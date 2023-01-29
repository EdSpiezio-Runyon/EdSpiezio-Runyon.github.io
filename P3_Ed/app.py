from flask import Flask, render_template, jsonify
import pandas
import json
import numpy as np

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/founded")
def founded():
    return render_template("founded.html")


@app.route("/appNotes.json")
def app_notes():
    df = pandas.read_csv('university_data.csv')
    
    data = {
        'features': [{cval : str(df.iloc[row, list(df.columns).index(cval)]) for cval in df.iloc[[row]]} for row in range(len(df))]
    }
    return jsonify(data)

@app.route("/api/v1.0/data")
def source_data():
    df=pandas.read_csv("university_data.csv").dropna()
    data = {x: df[x].tolist() for x in df.columns}
    return jsonify(data)


@app.route("/api/v1.0/lat_long")
def lat_long():
    df=pandas.read_csv ("university_data.csv")
    data = {
      'lat': df["latitude"].tolist(),
      'long': df["longitude"].tolist(),
      'another_col': ['data_here']
    }
    return jsonify(data)


@app.route("/api/v1.0/Collage_Name")
def Collage_Name():
    df=pandas.read_csv ("university_data.csv")
    data = {
      'Collage_Name': df["Name"].tolist(),
      'another_col': ['data_here']
    }
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
    