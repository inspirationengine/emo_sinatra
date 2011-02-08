require 'rubygems'
require 'mongoid'
require 'erb'
Dir["#{APP_ROOT}/models/*.rb"].each {|model| require model }

helpers do #Available in view, i believe :)
  include Rack::Utils
  alias_method :h, :escape_html

end

get '/:platform/index.php' do
  @survey = Survey.find(:first, :conditions => {:code => params[:uid]})
  logger.debug @survey.nil? ? 'not found' : @survey.short_stimulus
  if @survey
    erb :index
  else
    "Survey not found"
  end
end


get '/index.php' do
  if params[:uid]
    redirect "/browser/index.php?uid=#{params[:uid]}"
  end
  @survey = Survey.new(:short_stimulus => 'dunno what')
  erb :index
end

get '/' do
  redirect '/index.php'
end

get '/create/:stimulus' do
  @survey = Survey.new(
    :user_id => 1,
    :short_stimulus => params[:stimulus],
    :created_at => DateTime.now,
    :updated_at => DateTime.now,
    :code => Time.now.to_i.to_s(31).upcase,
    :action_token => "dildo#{Time.now.to_i}"
  )
  "Survey '#{@survey.short_stimulus}' #{@survey.save ? 'successfuly' : '<b>NOT</b>'} created"
end

get '/list' do
  @surveys = Survey.all
  @surveys.map{|s| "#{s.id} : #{s.short_stimulus} / #{s.code}" }.join('<br/>')
end

#not_found do
#  # Change this URL to wherever you want to be redirected if a non-existing URL key or an invalid action is called.
#  redirect "http://localhost:9292/"
#end

