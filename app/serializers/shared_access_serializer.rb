# frozen_string_literal: true

class SharedAccessSerializer < ApplicationSerializer
  include Avatarable
  attributes :name, :id, :avatar

  def avatar
    user_avatar(object)
  end
end
