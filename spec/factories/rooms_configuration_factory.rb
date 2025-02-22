# frozen_string_literal: true

FactoryBot.define do
  factory :rooms_configuration do
    meeting_option
    provider { 'greenlight' }
    value { %w[true false optional default_enabled].sample }
  end
end
