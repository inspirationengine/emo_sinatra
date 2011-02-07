require 'rubygems'
require 'mongo_mapper'
require 'uri'
require 'digest/md5'
require 'models/url'

# If using Basic Authentication, please change the default passwords!
CREDENTIALS = ['mongoshort', 'mongoshort']

configure :development do
  MongoMapper.database = 'mongoshort_dev'
end

configure :test do
  MongoMapper.database = 'mongoshort_test'
end

configure :production do
  # If using a database outside of where MongoShort is running (like MongoHQ - http://www.mongohq.com/), specify the connection here.
  # MongoMapper.connection = Mongo::Connection.new('mongo.host.com', 27017)
  MongoMapper.database = 'mongoshort'
  
  # Only necessary if your database needs authentication (strongly recommended in production).
  # MongoMapper.database.authenticate(ENV['mongodb_user'], ENV['mongodb_pass'])
end

helpers do

end

get '/' do
  # You can set up an index page (under the /public directory).
  "bzz"
end

get '/new' do

  content_type :json
  
  if !params[:url]
    status 400
    return { :error => "'url' parameter is missing" }.to_json
  end
  
  url = URL.find_or_create(params[:url])
  return url.to_json
end

get '/:url' do
  url = URL.find_by_url_key(params[:url])
  if url.nil?
    raise Sinatra::NotFound
  else
    url.last_accessed = Time.now
    url.times_viewed += 1
    url.save
    redirect url.full_url, 301
  end
end

not_found do
  # Change this URL to wherever you want to be redirected if a non-existing URL key or an invalid action is called.
  redirect "http://localhost:9292/"
end
