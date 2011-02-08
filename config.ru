require 'rubygems'
APP_ROOT = File.dirname(File.expand_path(__FILE__))

# Set up gems listed in the Gemfile.
gemfile = "#{APP_ROOT}/Gemfile"
begin
  ENV['BUNDLE_GEMFILE'] = gemfile
  require 'bundler'
  Bundler.setup
rescue Bundler::GemNotFound => e
  STDERR.puts e.message
  STDERR.puts "Try running `bundle install`."
  exit!
end if File.exist?(gemfile)

require 'sinatra'
require 'mongo_mapper'
require 'configuration'
require 'harvester'

run Sinatra::Application
