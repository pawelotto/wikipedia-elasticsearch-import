# wikipedia-elasticsearch-import #
Import Wikipedia dumps into Elasticsearch server using streams and bulk indexing for speed.

## What does this module do? ##
__Wikipedia__ is publishing __dumps of their whole database__ in every language on a regular basis, which you can download and use for free.
This module parses the giant Wikipedia xml dump file, converts it into stream and imports the contents right into your Elasticsearch server or farm.

### How to import Wikipedia dump into your own Elasticsearch server ###
1. In order to import Wikpedia dump you must run the Elasticsearch server first. Please refer to Elasticsearch documentation how to do this.
2. Download latest Wikipedia from one of the following locations depending on the language you want: 
* Wikipedia in English dump: https://dumps.wikimedia.org/enwiki/
* Wikipedia in German dump: https://dumps.wikimedia.org/dewiki/
* Wikipedia in Polish dump: https://dumps.wikimedia.org/plwiki/
* Other Wikidata dumps you can download: https://dumps.wikimedia.org/wikidatawiki/
3. Unzip the downloaded file _.xml.bz2_ into the unzipped _.xml_ file.
4. Edit the _config.js_ file to configure __Wikipedia dump .xml__ file and Elasticsearch server connection settings.
5. Run the importer with __npm start__ and watch your Elasticsearch database is being populated with raw Wikipedia documents.

### Settings ###
* You can set limit on bulk documents import in the _config.js_ which is 100 by default. 
* Set _index_, _type_, _host_, _port_, and _logFile_. If you enabled _x-pack_ plugin for Elasticsearch you can also set the _httpAuth_ setting, otherwise it's ignored.

### Please contribute ###
Please visit my GitHub to post your questions, suggestions and pull requests.
