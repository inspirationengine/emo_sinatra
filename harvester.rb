require 'rubygems'
require 'mongoid'
require 'configuration'
require 'erb'
Dir["#{APP_ROOT}/models/*.rb"].each {|model| require model }

helpers do #Available in view, i believe :)
  include Rack::Utils
  alias_method :h, :escape_html

end


get '/' do
  erb :index
end

#not_found do
#  # Change this URL to wherever you want to be redirected if a non-existing URL key or an invalid action is called.
#  redirect "http://localhost:9292/"
#end

