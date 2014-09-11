class Api::UsersController < ApplicationController

  respond_to :json

  def index
    respond_with(:api, User.all)
  end

  def show
    respond_with(:api, User.find(params[:id]))
  end

  def create
    respond_with(:api, User.create(params[:user]))
  end

  def update
    respond_with(:api, User.update(params[:id], params[:user]))
  end

  def destroy
    respond_with(:api, User.destroy(params[:id]))
  end

end