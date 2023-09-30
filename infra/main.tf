provider "aws" {
  region = "eu-west-1"
}

resource "aws_dynamodb_table" "demo-table" {
  name         = "demo-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  attribute {
    name = "gsi1_pk"
    type = "S"
  }

  attribute {
    name = "gsi1_sk"
    type = "S"
  }

  attribute {
    name = "gsi2_pk"
    type = "S"
  }

  attribute {
    name = "gsi2_sk"
    type = "S"
  }

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1_pk"
    range_key       = "gsi1_sk"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "gsi2"
    hash_key        = "gsi2_pk"
    range_key       = "gsi2_sk"
    projection_type = "ALL"
  }
}

resource "aws_sns_topic" "demo" {
  name = "demo-topic"
}

resource "aws_sqs_queue" "processor_queue" {
  name                      = "processor-queue"
  receive_wait_time_seconds = 20
  message_retention_seconds = 18400
}

resource "aws_sqs_queue" "legacy_queue" {
  name                      = "legacy-queue"
  receive_wait_time_seconds = 20
  message_retention_seconds = 18400
}

resource "aws_sns_topic_subscription" "processor_subscription" {
  protocol             = "sqs"
  raw_message_delivery = true
  topic_arn            = aws_sns_topic.demo.arn
  endpoint             = aws_sqs_queue.processor_queue.arn

  filter_policy = jsonencode({
    EventType = ["CourseComplete", "ChapterComplete"]
  })
}

resource "aws_sns_topic_subscription" "legacy_subscription" {
  protocol             = "sqs"
  raw_message_delivery = true
  topic_arn            = aws_sns_topic.demo.arn
  endpoint             = aws_sqs_queue.legacy_queue.arn

  filter_policy = jsonencode({
    EventType = ["StudentUpdate"]
  })
}

resource "aws_sqs_queue_policy" "processor_subscription_policy" {
  queue_url = aws_sqs_queue.processor_queue.id
  policy    = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "sns.amazonaws.com"
      },
      "Action": [
        "sqs:SendMessage"
      ],
      "Resource": [
        "${aws_sqs_queue.processor_queue.arn}"
      ],
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.demo.arn}"
        }
      }
    }
  ]
}
EOF
}

resource "aws_sqs_queue_policy" "legacy_subscription_policy" {
  queue_url = aws_sqs_queue.legacy_queue.id
  policy    = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "sns.amazonaws.com"
      },
      "Action": [
        "sqs:SendMessage"
      ],
      "Resource": [
        "${aws_sqs_queue.legacy_queue.arn}"
      ],
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.demo.arn}"
        }
      }
    }
  ]
}
EOF
}

output "demo_topic_arn" {
  value = aws_sns_topic.demo.arn
}

output "processor_queue_arn" {
  value = aws_sqs_queue.processor_queue.arn
}

output "legacy_queue_arn" {
  value = aws_sqs_queue.legacy_queue.arn
}

output "dynamodb_stream_arn" {
  value = aws_dynamodb_table.demo-table.stream_arn
}
