# frozen_string_literal: true

class RoomSerializer < ApplicationSerializer
  attributes :id, :name, :friendly_id, :online, :participants, :last_session

  attribute :shared_owner, if: -> { object.shared }

  def shared_owner
    object.user.name
  end
end
