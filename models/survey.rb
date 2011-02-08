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
  include Mongoid::Document

  #It's still not clear to me about document IDs in mongo.... and associations o_O

  field :user_id, :type => Integer
  field :short_stimulus
  field :score, :type => Float, :default => 0.0
  field :responses_count, :type => Integer, :default => 0
  field :active, :type => Boolean, :default => true
  field :public, :type => Boolean, :default => false
  field :created_at, :type => DateTime
  field :updated_at, :type => DateTime
  field :code
  field :action_token
  #index :code, :unique => true

end