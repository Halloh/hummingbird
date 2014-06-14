Hummingbird.CommunityWidgetComponent = Ember.Component.extend({
  classNames: ["latest-posts-panel"],
  topics: [],

  loadPosts: function() {
    var self = this;

    ic.ajax({
      url: this.get('apiCall'),
      type: "GET",
      xhrFields: {
        withCredentials: true
      }
    }).then(function(data) {

      var users = {},
          topics = [];

      data.users.forEach(function(user) {
        users[user.id] = user;
      });

      for (var i=0; i<data.topic_list.topics.length; i++) {
        var topicInfo = data.topic_list.topics[i],
            topic = {};

        if (topics.length === 5) break;
        if (topicInfo.pinned) continue;

        topic.title = topicInfo.title;
        topic.url = "http://forums.hummingbird.me/t/" + topicInfo.slug + "/" + topicInfo.id + "/" + (topicInfo.last_read_post_number!==undefined ? topicInfo.last_read_post_number : "");
        topic.postCount = topicInfo.highest_post_number;
        topic.lastPostTime = topicInfo.last_posted_at;

        topic.users = [];
        topicInfo.posters.forEach(function(poster) {
          var user = users[poster.user_id];
          topic.users.push({
            name: user.username,
            avatar: "http://forums.hummingbird.me" + user.avatar_template.replace("{size}", "20"),
            url: "http://forums.hummingbird.me/users/" + user.username + "/activity"
          });
        });

        topics.push(topic);
      }

      self.set('topics', topics);

    }, function() {
      console.log("Could not load " + self.get('apiCall'));
    });
  }.on('init')
});
