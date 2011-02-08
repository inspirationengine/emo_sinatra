require 'yaml'
require 'logger'

APP_ENV = (ENV['RACK_ENV'] || 'development').to_sym
APP_CONFIG = YAML.load(File.read("#{APP_ROOT}/environments.yml"))[APP_ENV]

configure do
  log_file = File.open("#{APP_ROOT}/log/#{APP_ENV}.log", 'a+')
  log_file.sync = true 
  logger = Logger.new(log_file)
  logger.level = Logger::DEBUG
  #STDOUT.reopen(log_file)  # Anton, this is for logfiles fans:)  no better solution currently
  #STDERR.reopen(log_file)  # Uncomment those lines to see all the stuff in the logfile
  set :logger, logger

  set :root, APP_ROOT
  set :static, true
  set :environment, APP_ENV
end
def logger; settings.logger; end

configure :development do
  enable :logging
  enable :dump_errors
end


# MongoDB configuration
# http://api.mongodb.org/ruby/current/Mongo/Connection.html#from_uri-class_method
# http://www.mongodb.org/display/DOCS/Connections
MongoMapper.connection = Mongo::Connection.from_uri("mongodb://#{APP_CONFIG[:mongo_host]}")
MongoMapper.database = APP_CONFIG[:mongo_database]
logger.debug MongoMapper.connection.inspect
# MongoMapper.database.authenticate(ENV['mongodb_user'], ENV['mongodb_pass'])
