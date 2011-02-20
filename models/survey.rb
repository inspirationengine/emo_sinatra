# == Schema Information
# Schema version: 20110123204321
#
# Table name: surveys
#
#  id              :integer(4)      not null, primary key
#  user_id         :integer(4)
#  project_name    :string(255)     not null
#  score           :float           default(0.0)
#  responses_count :integer(4)      default(0)
#  active          :boolean(1)      default(FALSE)
#  public          :boolean(1)      default(FALSE)
#  created_at      :datetime
#  updated_at      :datetime
#  code            :string(20)      not null
#  action_token    :string(255)
#
# Currently the valid types in Mongoid are: 
# Array, BigDecimal, Boolean, Date, DateTime, Float, Hash, Integer, String, Symbol, Time 
# and any object that inherits from Mongoid::Document

class Survey
  include MongoMapper::Document

  #It's still not clear to me about document IDs in mongo.... and associations o_O

  key :user_id, Integer
  key :short_stimulus, String, :required => true
  key :score, Float, :default => 0.0
  key :responses_count, Integer, :default => 0
  key :active, Boolean, :default => true
  key :public, Boolean, :default => false
  key :code, String, :index => true, :required => true
  key :action_token, String
  key :survey_responses_count_cache
  
  timestamps!
  
  many :survey_responses

  def survey_responses_count # counter cache emu
    update_attributes({:survey_responses_count_cache => survey_responses.count}) if read_attribute(:survey_responses_count_cache).nil?
    self.survey_responses_count_cache
  end

end