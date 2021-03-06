import 'package:dev_doctor/models/course.dart';
import 'package:dev_doctor/models/part.dart';
import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:url_launcher/url_launcher.dart';

typedef NavigateCallback = void Function(int part);

class CourseDrawer extends StatefulWidget {
  final Course course;
  final NavigateCallback onChange;

  const CourseDrawer({Key key, this.course, this.onChange}) : super(key: key);
  @override
  _CourseDrawerState createState() => _CourseDrawerState();
}

class _CourseDrawerState extends State<CourseDrawer> {
  int serverId, courseId, partId;
  @override
  void initState() {
    serverId = int.parse(Modular.args.queryParams['serverId']);
    courseId = int.parse(Modular.args.queryParams['courseId']);
    partId = int.parse(Modular.args.queryParams['partId']);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var supportUrl = widget.course.supportUrl ?? widget.course.server.supportUrl;
    return Drawer(
        child: Scrollbar(
            child: ListView(children: [
      ListTile(
        title: Text('course.back').tr(),
        leading: Icon(Icons.keyboard_backspace_outlined),
        onTap: () {
          Navigator.of(context).pop();
          Navigator.of(context).pop();
        },
      ),
      if (supportUrl != null)
        ListTile(
          title: Text('course.support').tr(),
          onTap: () => launch(supportUrl),
          leading: Icon(Icons.help_outline_outlined),
        ),
      Divider(),
      FutureBuilder<List<CoursePart>>(
          future: widget.course.fetchParts(),
          builder: (context, snapshot) {
            if (snapshot.hasError)
              return Text("Error ${snapshot.error}");
            else if (!snapshot.hasData || snapshot.connectionState == ConnectionState.waiting)
              return Center(child: CircularProgressIndicator());
            var parts = snapshot.data;
            return Column(
                children: List.generate(parts.length, (index) {
              var part = parts[index];
              return ListTile(
                title: Text(part.name),
                subtitle: Text(part.description ?? ''),
                selected: Modular.args.queryParams['partId'] == index.toString(),
                onTap: () {
                  setState(() => partId = index);
                  widget.onChange(index);
                },
                isThreeLine: true,
              );
            }));
          })
    ])));
  }
}
