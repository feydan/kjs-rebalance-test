1. Clone this repo, and `cd` to the cloned directory
2. `npm install`
3. Replace `BROKER_LIST` in **constants.js** with a set of brokers you have access to create topics and publish to
   - Alternatively, you can spin up kafka/zookeper locally with `docker-compose up`
4. Run 1 instance of **runner.js** using `node runner.js`
5. Wait a 7-8 minutes for consumers to disconnect and reconnect

This will:

- Set kafka offsets.retention.minutes to 3 and offsets.retention.check.interval.ms to 60000
- Create a topic and publish 10 messages to it
- Initialize consumers where each message is logged as a new line to **results.csv**
- Connect the consumer for 6 minutes
- Stop the consumer for 1 minute
- Restart the consumer

The intention was to try to recreate a potential offset retention issue that was encountered on a stale topic.  The theory was that:
 
 - Given a consumer on stale topic that hasn't had new messages for more than the retention window (and the consumer has not had commits for longer than the retention window)
 - If the consumer enters an empty state, it will reset offsets when reconnected.

EXPECTED: **results.csv** almost always contains 10 entries

ACTUAL: **results.csv** <not able to recreate issue>

## References

Docker-compose kafka/zookeper setup taken from https://github.com/wurstmeister/kafka-docker
