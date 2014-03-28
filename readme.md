# s3empty

Delete all files in an S3 bucket.

## Install

```sh
git clone https://github.com/rclark/s3empty.git
cd s3empty
npm install -g
```

## Configuration

Requires a configuration file containing your AWS key and secret at `~/.cfnrc`. That file should be as follows:

```json
{
    "accessKeyId": "xxxxxx",
    "secretAccessKey": "xxxxxx"
}
```


## Usage

```
s3empty <bucket> [--region bucket-region]
```

Defaults to `us-east-1` region.