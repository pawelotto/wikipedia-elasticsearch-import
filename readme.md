# wikipedia-import-dump #
Import Wikipedia dumps into Elasticsearch server using streams and bulk indexing for speed.

## What does it do? ##
__Wikipedia__ is publishing __dumps of their whole database__ in every language on a regular basis, which you can download and use for free.
This module parses the giant Wikipedia xml dump file, converts it into stream and imports the contents right into your Elasticsearch server or farm.

### How to import Wikipedia dump into your own Elasticsearch server ###
1. In order to import Wikpedia dump you must run the Elasticsearch server first. Please refer to Elasticsearch documentation how to do this.
2. Download latest Wikipedia from one of the following locations depending on the language you want: 
* Wikipedia in English dump: https://dumps.wikimedia.org/enwiki/
* Wikipedia in German dump: https://dumps.wikimedia.org/dewiki/
* Wikipedia in Polish dump: https://dumps.wikimedia.org/plwiki/
* Other Wikidata dumps you can download: https://dumps.wikimedia.org/wikidatawiki/
3. Unzip the downloaded file into the pure .xml file.
4. Edit the _config.js_ file to configure __Wikipedia dump .xml__ file and Elasticsearch server connection settings.
5. Run the importer with _npm start_ and watch your Elasticsearch database is being populated with pure Wikipedia documents.

### Settings ###
* You can set limit on bulk documents import in the _config.js_ which is 100 by default. 
* Set _index_, _type_, _host_, _port_, _logFile_ and _httpAuth_ if you enabled _x-pack_ plugin for Elasticsearch. You don't have to setup httpAuth if your server isn't using authentication.

### Please contribute ###
Please visit my GitHub to post your questions, suggestions and pull requests.
