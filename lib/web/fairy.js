// Generated by CoffeeScript 1.7.1
(function() {
  var events_bind, interval, render_master, render_slave, select_index, statistics, statistics_template;

  statistics_template = ['<table class="table table-bordered overview">', '<thead><tr><th>Queue</th><th>Workers</th><th>Avg. Time</th><th>Total</th><th>Finished</th><th>Processing</th><th>Pending</th><th>Failed</th><th>Blocked</th><th>Schedule</th><th>Clear</th></tr></thead>', '<tbody>', '<% _.each(data, function(item){ %>', '<tr>', '<td><%= item.name %></td><td><%= item.workers%></td><td><%= item.average_pending_time + item.average_process_time%></td><td><span><%= item.total.tasks%></span><span>/</span><span><%= item.total.groups%><span></td><td><%= item.finished_tasks%></td><td><%= item.processing_tasks%></td><td><%= item.pending_tasks%></td><td><%= item.failed_tasks%></td><td><span><%= item.blocked.tasks%></span><span>/</span><span><%= item.blocked.groups%><span></td><td><button class="btn_reschedule">Schedule</button></td><td><button class="btn_clear">Clear</button></td>', '</tr>', '<%})%>', '</tbody>', '<tfoot>', '<tr>', '<td>Total</td><td><%= _.reduce(data, function(memo, item){ return memo + Number(item.workers); }, 0)%></td><td>-</td><td><span><%= _.reduce(data, function(memo, item){ return memo + Number(item.total.tasks); }, 0)%></span><span>/</span><span><%= _.reduce(data, function(memo, item){ return memo + Number(item.total.groups); }, 0) %></span></td><td><%= _.reduce(data, function(memo, item){ return memo + Number(item.finished_tasks); }, 0)%></td><td><%= _.reduce(data, function(memo, item){ return memo + Number(item.processing_tasks); }, 0)%></td><td><%= _.reduce(data, function(memo, item){ return memo + Number(item.pending_tasks); }, 0)%></td><td><%= _.reduce(data, function(memo, item){ return memo + Number(item.failed_tasks); }, 0)%></td><td><span><%= _.reduce(data, function(memo, item){ return memo + Number(item.blocked.tasks); }, 0)%></span><span>/</span><span><%= _.reduce(data, function(memo, item){ return memo + Number(item.blocked.groups); }, 0)%></span></td><td>&nbsp;</td><td>&nbsp;</td>', '</tr>', '</tfoot>', '</table>'];

  statistics = [];

  select_index = 0;

  interval = $("select option:selected").val();

  $(function() {
    $('select').find("option:nth-child(1)").attr("selected", "true");
    render_master();
    return events_bind();
  });

  render_master = function() {
    console.log((new Date).toString());
    $('button').die("click");
    return $.get('/api/queues/statistics', function(data) {
      var name;
      $('#m_statistics').html(_.template(statistics_template.join(''), {
        data: data
      }));
      if ($('#queque_detail').is(":visible")) {
        $($('#m_statistics tbody tr')[select_index]).attr("class", "active");
        name = $($($('#m_statistics tbody tr')[select_index]).find('td:first')).html();
        render_slave(name);
      }
      return setTimeout(render_master, interval * 1000);
    });
  };

  render_slave = function(name) {
    var command, commands, _i, _len, _results;
    commands = ['statistics', 'recently_finished_tasks', 'failed_tasks', 'slowest_tasks', 'processing_tasks', 'workers'];
    _results = [];
    for (_i = 0, _len = commands.length; _i < _len; _i++) {
      command = commands[_i];
      _results.push((function(command) {
        return $.get('/api/queues/' + name + ("/" + command), function(results) {
          var param;
          param = {};
          param[command] = results;
          $("#s_" + command).html(_.template($("#tb_" + command + "_template").html(), param));
          if (command === 'failed_tasks') {
            $(".failed_popover").find(".nav-tabs>li:first").addClass("active");
            return $(".failed_popover").find(".tab-content>div:first").addClass("active");
          }
        });
      })(command));
    }
    return _results;
  };

  events_bind = function() {
    var command, _i, _len, _ref, _results;
    $('#m_statistics').find('tbody tr').live('click', function() {
      var name;
      $('#m_statistics tr').removeAttr('class');
      $(this).attr("class", "active");
      select_index = $(this).index();
      name = $($(this).find('td')[0]).html();
      render_slave(name);
      return $('#queque_detail').show();
    });
    _ref = ['reschedule', 'clear'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      command = _ref[_i];
      _results.push((function(command) {
        return $("#m_statistics .btn_" + command).live('click', function(event) {
          var name, that;
          event.stopPropagation();
          name = $(this).parent().parent().find('td:first').html();
          that = this;
          return $.ajax({
            type: 'POST',
            url: '/api/queues/' + name + ("/" + command),
            success: function(result) {
              var index;
              $(that).parent().parent().html(_.template(statistics_template[5], {
                item: result
              }));
              index = $(that).parent().parent().index();
              statistics[index] = result;
              return $('#m_statistics tr:last').html(_.template(statistics_template[11], {
                data: statistics
              }));
            }
          });
        });
      })(command));
    }
    return _results;
  };

  $("select").change(function() {
    return interval = $(this).val();
  });

  $('.icon-th').click(function() {
    $('#s_workers + .tabbable').addClass('xz');
    $(this).addClass('active');
    return $('.icon-th-large').removeClass('active');
  });

  $('.icon-th-large').click(function() {
    $('#s_workers + .tabbable').removeClass('xz');
    $(this).addClass('active');
    return $('.icon-th').removeClass('active');
  });

  $(document).scroll(function() {
    var scroll_top;
    scroll_top = $(document).scrollTop();
    if (scroll_top > 40) {
      return $('h1').addClass("h1_shadow");
    } else {
      return $('h1').removeClass("h1_shadow");
    }
  });

  this.parse_milliseconds = function(milli) {
    var second;
    second = milli / 1000;
    if (second < 1) {
      return milli + 'ms';
    }
    if ((1 < second && second < 60)) {
      return Math.floor(second) + 's';
    }
    if (second > 60) {
      return Math.floor(second / 60) + 'm' + ':' + Math.floor(second % 60) + 's';
    }
  };

  this.id_factory = function() {
    var i;
    i = 0;
    return {
      "new": function() {
        return i++;
      }
    };
  };

}).call(this);