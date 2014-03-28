#!/usr/bin/env node

var AWS = require('aws-sdk');
var env = require('superenv')('cfn');
var _ = require('underscore');
var argv = require('optimist')
    .options('region', {
        alias: 'r',
        default: 'us-east-1'
    })
    .demand(1)
    .check(function(argv) {
        argv.bucket = argv._[0];
    })
    .argv;

var s3 = new AWS.S3(_(env).extend({ region: argv.region }));
var count = 0;

function deleteObjects(err, data) {
    if (err) throw err;
    if (data.Contents.length === 0) return console.log('Empty!');

    var keys = _(data.Contents).map(function(file) {
        return { Key: file.Key };
    });
    var marker = keys[keys.length - 1].Key;
    if (data.IsTruncated) listObjects(marker);

    s3.deleteObjects({
        Bucket: argv.bucket,
        Delete: { Objects: keys }
    }, function (err, response) {
        if (err) throw err;
        count = count + data.Contents.length;
        console.log('Deleted %s files', count);
    });
}

function listObjects(marker) {
    var params = { Bucket: argv.bucket };
    if (marker) params.Marker = marker;
    s3.listObjects(params, deleteObjects);
}

listObjects();