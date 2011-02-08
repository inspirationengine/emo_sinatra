require 'yaml'
require 'logger'

APP_CONFIG = YAML.load(File.read("#{APP_ROOT}/environments.yml"))[settings.environment]
APP_ENV = (ENV['RACK_ENV'] || 'development').to_sym

set :root, APP_ROOT
set :static, true
set :environment, APP_ENV

configure do
  log_file = File.open("#{APP_ROOT}/log/#{APP_ENV}.log", 'a+')
  log_file.sync = true 
  logger = Logger.new(log_file)
  logger.level = Logger::DEBUG
  #STDOUT.reopen(log_file)  # Anton, this is for logfiles fans:)  no better solution currently
  #STDERR.reopen(log_file)  # Uncomment those lines to see all the stuff in the logfile
  set :logger, logger
end
def logger; settings.logger; end

enable :logging
enable :dump_errors


# MongoDB configuration
Mongoid.configure do |config|
  #http://api.mongodb.org/ruby/current/Mongo/Connection.html#from_uri-class_method
  config.master = Mongo::Connection.from_uri("mongodb://#{APP_CONFIG[:mongo_host]}").db(APP_CONFIG[:mongo_database])
end