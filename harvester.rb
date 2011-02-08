require 'rubygems'
require 'mongoid'
require 'erb'
Dir["#{APP_ROOT}/models/*.rb"].each {|model| require model }

helpers do #Available in view, i believe :)
  include Rack::Utils
  alias_method :h, :escape_html

end

get '/:platform/index.php' do
  puts params[:uid]
  erb :index
end


get '/index.php' do
  if params[:uid]
    redirect "/browser/index.php?uid=#{params[:uid]}"
  end
  erb :index
end

get '/' do
  redirect '/index.php'
end

#not_found do
#  # Change this URL to wherever you want to be redirected if a non-existing URL key or an invalid action is called.
#  redirect "http://localhost:9292/"
#end

