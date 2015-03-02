(function() {
	this.YoutubeVideoInfo = function YoutubeVideoInfo(inputElement, infoElement) {
		if(!inputElement || !infoElement) {
			throw new Error('youtubeVideoInfo: input / information block is not provided');
			return;
		}

		var apiURL = 'http://gdata.youtube.com/feeds/api/videos/';

		return {
			init: function() {
				var self = this;

				this.blocks = {
					videoBlock: document.querySelector(inputElement),
					infoBlock: document.querySelector(infoElement)
				};

				this.blocks.infoBlock.className = "youtube-video-info-block";
				this.blocks.videoBlock.addEventListener('change', function(event) {
					self.drawInfo(this, event, self);
				}, false);
			},

			drawInfo: function(element, event, fn) {
				var value = (/^(.*)\/\/(.*)\/((\w+\?)(.*)[&]?(v=)|\/)(\w+).*$/gi.exec(element.value)||[null]).pop();

				if(!value) {
					throw new Error('youtubeVideoInfo: URL is not valid');
					return;
				}

				this.blocks.infoBlock.innerHTML = '';
				this.blocks.infoBlock.classList.add('loading');

				this.getData(value, this.loaded.bind(this), this.failed);
			},

			getData: function(id, success, failure) {
			    var xhr = new XMLHttpRequest();
			    var self = this;
			    xhr.open('GET', apiURL + id + '?alt=json');

			    var timeout = setTimeout(function() {
			        xhr.abort();
			    }, 10000);

			    xhr.onreadystatechange = function() {
			        if (xhr.readyState === 4) {
			            if (xhr.status === 200) {
			                success(xhr);
			            } else {
			                failure();
			            }

			            self.blocks.infoBlock.classList.remove('loading');
			        }
			    }
			    xhr.send(null);
			},

			loaded: function(data) {
				var res = JSON.parse(data.responseText),
					dataList = document.createElement('ul');

				console.log(res);

				dataList.className = "youtube-video-info-data";

				dataList.innerHTML += '<li class="youtube-video-info-data-title">' + res.entry.title.$t + '</li>';

				dataList.innerHTML += '<li class="youtube-video-info-data-author">' + res.entry.author[0].name.$t + '</li>';

				dataList.innerHTML += '<li class="youtube-video-info-data-duration">' + this.getDuration(res.entry.media$group.media$content[0].duration) + '</li>';

				dataList.innerHTML += '<li class="youtube-video-info-data-thumb"><img src="' + res.entry.media$group.media$thumbnail[0].url + '" alt="" /></li>';

				dataList.innerHTML += '<li class="youtube-video-info-data-link"><a href="' + res.entry.link[0].href + '">' + res.entry.link[0].href + '</a></li>';

				this.blocks.infoBlock.appendChild(dataList);

				dataList = null;
			},

			failed: function() {
				alert('Loading failure');
			},

			getDuration: function(duration) {
				var d = '';
				if(Math.floor(duration / (60*60))) {
					d += Math.floor(duration / (60*60)) + 'h ';
					duration -= Math.floor(duration / (60*60)) * 60 * 60;
				}

				if(Math.floor(duration / (60))) {
					d += Math.floor(duration / (60)) + 'm ';
					duration -= Math.floor(duration / (60)) * 60;
				}

				d += duration + 's';

				return d;
			}
		};
	};
})();