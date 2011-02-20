require 'rubygems'
require 'erb'
Dir["#{APP_ROOT}/models/*.rb"].each {|model| require model }

enable :sessions

after do # kindof rails param loggin
  puts '[Params]'
  p params
end

helpers do #Available in view, i believe :)
  include Rack::Utils
  alias_method :h, :escape_html
end

get '/:platform/index.php' do
  @survey = Survey.first(:code => params[:uid]) unless params[:uid].nil? # when code is blank - new survey object is created in DB
  session[:current_survey_code] = (params[:uid].nil?) ? nil : params[:uid]
  session[:survey_start_time] = Time.now
  erb :index
end

get '/response_for/:survey_code' do
  content_type :json
  @survey = Survey.first(:code => params[:survey_code])
  response = SurveyResponse.new
  response.end_time = Time.now
  response.start_time = response.end_time - 3.minutes
  response.ip = request.ip
  response.emote = params[:emote]
  response.intensity_level = params[:intensity_level]  
  @survey.survey_responses << response
  { :success => true }.to_json
end

get '/responses_for/:survey_code' do
  @survey = Survey.first(:code => params[:survey_code])
  p @survey.survey_responses.all
  "#{@survey.survey_responses_count}"
end

get '/index.php' do
  if params[:uid]
    redirect "/browser/index.php?uid=#{params[:uid]}"
  else
    redirect "/browser/index.php"
  end
end

post '/:platform/index.php' do
  if !params[:action].nil? && params[:action] == 'getsurvey'
    # { action:getsurvey, survey:1RZU573, out:json }
    @survey = Survey.first(:code => params[:survey]) unless params[:survey].nil?
    content_type :json
    
    if @survey.nil?
      { :status => "error", :msg => "Survey not found" }.to_json 
    else
      { :status => "ok",:msg => erb(:_survey_body).to_s }.to_json
    end
  elsif !params[:action].nil? && params[:action] == 'savesurveyresult'
    # {"verbatim"=>"Because...cvffghfgh", "intensity_level"=>"87", "out"=>"json", "action"=>"savesurveyresult", "emote"=>"delighted"}
    content_type :json
    @survey = Survey.first(:code => session[:current_survey_code])
    response = SurveyResponse.new
    response.end_time = Time.now
    response.start_time = session[:survey_start_time]
    response.ip = request.ip
    response.emote = params[:emote]
    response.intensity_level = params[:intensity_level]
    response.verbatim = params[:verbatim]
    @survey.survey_responses << response
    session[:current_survey_code], session[:survey_start_time] = nil, nil
    { :success => true }.to_json
  end
end

get '/:survey_code' do
  redirect "/browser/index.php?uid=#{params[:survey_code]}"
end

get '/' do
  redirect '/index.php'
end


#not_found do
#  # Change this URL to wherever you want to be redirected if a non-existing URL key or an invalid action is called.
#  redirect "http://localhost:9292/"
#end

