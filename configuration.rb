require 'yaml'

set :root, APP_ROOT
set :static, true

set :environment, (ENV['RACK_ENV'] || 'development').to_sym

APP_CONFIG = YAML.load(File.read("#{APP_ROOT}/environments.yml"))[settings.environment]

enable :logging
enable :dump_errors

# MongoDB configuration
Mongoid.configure do |config|
  #http://api.mongodb.org/ruby/current/Mongo/Connection.html#from_uri-class_method
  config.master = Mongo::Connection.from_uri("mongodb://#{APP_CONFIG[:mongo_host]}").db(APP_CONFIG[:mongo_database])
end