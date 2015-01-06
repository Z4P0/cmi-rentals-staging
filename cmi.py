import os
from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def hello():
    # handle the zip config
    # build the folder
    # then create the zip
    # make sure it's in the static/downloads

    return render_template('index.html')


# # /about/32
# @app.route('/about/<user_id>')
# def about_us(user_id):

#     # we have the id of the user
#     # hit the databse with that primary key
#     # and pull out all the data on that table
#     # do cool stuff with it

#     return render_template('about-us.html', user_id=user_id)


# # @app.route('/upload')
# #     # webform
# #     #
