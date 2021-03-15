1. Clone this repo, and `cd` to the cloned directory
2. `npm install`
3. Replace `BROKER_LIST` in **constants.js** with a set of brokers you have access to create topics and publish to
   - Alternatively, you can splin up kafka/zookeper locally with `docker-compose up`
4. Run a few instances of **runner.js** in parallel in separate terminals using `node runner.js`
5. Wait a few minutes for all messages to be consumed

This will:

- Create a topic and publish 1200 messages to it
- Initialize consumers where each message is logged as a new line to **results.csv**
- (Each consumer will occaisionally disconnect/re-subscribe every few seconds to trigger rebalances)

EXPECTED: **results.csv** almost always contains 1200 entries

ACTUAL: **results.csv** almost always contains 1400-1600 entries due to redeliveries

## References

Docker-compose kafka/zookeper setup taken from https://github.com/wurstmeister/kafka-docker