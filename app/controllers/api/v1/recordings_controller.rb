# frozen_string_literal: true

module Api
  module V1
    class RecordingsController < ApiController
      before_action :find_recording, only: %i[update update_visibility]
      before_action only: %i[destroy] do
        ensure_authorized('ManageRecordings', record_id: params[:id])
      end
      before_action only: %i[update update_visibility] do
        ensure_authorized(%w[ManageRecordings SharedRoom], record_id: params[:id])
      end
      before_action only: %i[index recordings_count] do
        ensure_authorized('CreateRoom')
      end

      # GET /api/v1/recordings.json
      # Returns all of the current_user's recordings
      def index
        sort_config = config_sorting(allowed_columns: %w[name length visibility])

        pagy, recordings = pagy(current_user.recordings&.order(sort_config, created_at: :desc)&.search(params[:search]))
        render_data data: recordings, meta: pagy_metadata(pagy), status: :ok
      end

      # PUT/PATCH /api/v1/recordings/:id.json
      # Updates a recording's name in both BigBlueButton and Greenlight
      def update
        new_name = recording_params[:name]
        return render_error errors: [Rails.configuration.custom_error_msgs[:missing_params]] if new_name.blank?

        BigBlueButtonApi.new.update_recordings record_id: @recording.record_id, meta_hash: { meta_name: new_name }
        @recording.update! name: new_name

        render_data data: @recording, status: :ok
      end

      # DELETE /api/v1/recordings/:id.json
      # Deletes a recording in both BigBlueButton and Greenlight
      def destroy
        # TODO: Hadi - Need to change this to work preferably with after_destroy in recordings model
        BigBlueButtonApi.new.delete_recordings(record_ids: params[:id])

        Recording.destroy_by(record_id: params[:id])

        render_data status: :ok
      end

      # POST /api/v1/recordings/update_visibility.json
      # Update's a recordings visibility by setting publish/unpublish and protected/unprotected
      def update_visibility
        new_visibility = params[:visibility]
        old_visibility = @recording.visibility
        bbb_api = BigBlueButtonApi.new

        bbb_api.publish_recordings(record_ids: @recording.record_id, publish: true) if old_visibility == 'Unpublished'

        bbb_api.publish_recordings(record_ids: @recording.record_id, publish: false) if new_visibility == 'Unpublished'

        bbb_api.update_recordings(record_id: @recording.record_id, meta_hash: { protect: true }) if new_visibility == 'Protected'

        bbb_api.update_recordings(record_id: @recording.record_id, meta_hash: { protect: false }) if old_visibility == 'Protected'

        @recording.update!(visibility: new_visibility)

        render_data status: :ok
      end

      # GET /api/v1/recordings/recordings_count.json
      # Returns the total number of recordings for the current_user
      def recordings_count
        count = current_user.recordings.count
        render_data data: count, status: :ok
      end

      private

      def recording_params
        params.require(:recording).permit(:name)
      end

      def find_recording
        @recording = Recording.find_by! record_id: params[:id]
      end
    end
  end
end
