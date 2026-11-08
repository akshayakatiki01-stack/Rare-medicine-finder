import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
static const String baseUrl = 'http://localhost:5000';

static Future<dynamic> searchMedicine(String name) async {
final url = Uri.parse(
'$baseUrl/api/inventory/search?name=${Uri.encodeComponent(name)}',
);


final response = await http.get(url);

if (response.statusCode == 200) {
  return jsonDecode(response.body);
} else {
  throw Exception('Failed to search medicines');
}


}
}
