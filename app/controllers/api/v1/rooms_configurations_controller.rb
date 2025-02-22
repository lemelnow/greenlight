# frozen_string_literal: true

module Api
  module V1
    class RoomsConfigurationsController < ApiController
      before_action only: %i[index] do
        ensure_authorized(%w[CreateRoom ManageSiteSettings ManageRoles ManageRooms], friendly_id: params[:friendly_id])
      end

      # GET /api/v1/rooms_configurations.json
      # Fetches and returns all rooms configurations.
      def index
        rooms_configs = MeetingOption.joins(:rooms_configurations)
                                     .where(rooms_configurations: { provider: current_provider })
                                     .pluck(:name, :value)
                                     .to_h

        render_data data: rooms_configs, status: :ok
      end
    end
  end
end
