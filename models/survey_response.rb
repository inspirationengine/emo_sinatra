# == Schema Information
# Schema version: 20110220073519
#
# Table name: survey_result
#
#  survey_result_id :integer(8)      not null, primary key
#  start_time       :datetime
#  end_time         :datetime
#  ip               :string(50)
#  emote            :string(255)
#  intensity_level  :integer(4)
#  verbatim         :text(16777215)
#  code             :string(255)
#  is_removed       :integer(1)      default(0)
#


class SurveyResponse
  include MongoMapper::Document

  key :start_time, Time, :required => true
  key :end_time, Time, :required => true
  key :ip, String, :required => true
  key :emote, String
  key :intensity_level, Integer
  key :verbatim, String
  key :survey_id, ObjectId
  key :removed, Boolean, :default => false
  
  belongs_to :survey
  
  before_save :recalculate_counter_cache_for_survey
  before_destroy :recalculate_counter_cache_for_survey
  
  def recalculate_counter_cache_for_survey
    survey.update_attributes({:survey_responses_count_cache => nil}) if survey
  end

end