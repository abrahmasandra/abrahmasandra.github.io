function loadYouTubeVideos(sortBy) {
    var apiKey = 'AIzaSyC8W_LzKQoscJT7PGsyWsZ1Nk4EcQi8GFI';
    var channelId = 'UCub38TXhT_RZkwLwyXtTpaA';
    var maxResults = 5;
  
    gapi.client.init({
      'apiKey': apiKey
    }).then(function() {
      return gapi.client.request({
        'path': 'https://www.googleapis.com/youtube/v3/search',
        'params': {
          'part': 'snippet',
          'channelId': channelId,
          'maxResults': maxResults,
          'type': 'video',
          'order': sortBy,
        }
      });
    }).then(function(response) {
      var videos = response.result.items;
      var thumbnailsContainer = document.getElementById('thumbnails-container');
      thumbnailsContainer.innerHTML = '';
      
      for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        var videoId = video.id.videoId;
        var title = video.snippet.title;
        var description = video.snippet.description;

        var thumbnailHtml = '<div class="card" style="text-align: center">';
        thumbnailHtml += '<img src="https://img.youtube.com/vi/' + videoId + '/mqdefault.jpg" alt="' + title + '">';
        thumbnailHtml += '<div class="card-body">';
        thumbnailHtml += '<h5 class="card-title">' + title + '</h5>';
        thumbnailHtml += '<p class="card-text">' + description + '</p>';
        thumbnailHtml += '<a href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank" class="btn btn-primary">Watch Video</a>';
        thumbnailHtml += '</div>';
        thumbnailHtml += '</div>';

        thumbnailsContainer.innerHTML += thumbnailHtml;
      }
    }, function(reason) {
      if (reason.result && reason.result.error) {
        console.error('Error: ' + reason.result.error.message);
      } else {
        console.error('Error: Unable to fetch videos.');
      }
    });
  }

  function onSortOptionSelected(sortBy) {
    loadYouTubeVideos(sortBy);
  }
  
  gapi.load('client', function() {
    // Set the initial sorting option (e.g., 'date' or 'viewCount')
    var initialSortOption = 'date';
    onSortOptionSelected(initialSortOption);
  
    // Event listener for the dropdown options
    var dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(function(item) {
      item.addEventListener('click', function(event) {
        event.preventDefault();
        var sortBy = this.getAttribute('data-sort');
        onSortOptionSelected(sortBy);
      });
    });
  });  