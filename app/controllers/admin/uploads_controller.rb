# Files uploaded from the Puck editor (images, documents for download).
# Returns a permanent URL that is stored in the page content.
class Admin::UploadsController < Admin::BaseController
  ALLOWED_TYPES = %w[
    image/jpeg image/png image/webp image/gif image/svg+xml
    application/pdf
    application/vnd.openxmlformats-officedocument.wordprocessingml.document
    application/vnd.openxmlformats-officedocument.presentationml.presentation
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    application/vnd.oasis.opendocument.text
    text/csv
  ].freeze
  MAX_SIZE = 25.megabytes

  def create
    file = params.expect(:file)

    unless file.respond_to?(:content_type) && ALLOWED_TYPES.include?(Marcel::MimeType.for(file, name: file.original_filename))
      return render json: { error: "This file type is not allowed." }, status: :unprocessable_content
    end
    if file.size > MAX_SIZE
      return render json: { error: "The file is larger than #{MAX_SIZE / 1.megabyte} MB." }, status: :unprocessable_content
    end

    blob = ActiveStorage::Blob.create_and_upload!(io: file, filename: file.original_filename)
    render json: {
      url: rails_blob_path(blob, only_path: true),
      filename: blob.filename.to_s,
      byte_size: blob.byte_size,
      content_type: blob.content_type
    }, status: :created
  end
end
