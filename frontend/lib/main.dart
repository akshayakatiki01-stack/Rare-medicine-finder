import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

const Color primaryColor = Color(0xFF087F8C);
const Color backgroundColor = Color(0xFFF5F8FA);

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Rare Medicine Finder',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: primaryColor,
        ),
        scaffoldBackgroundColor: backgroundColor,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController searchController =
      TextEditingController();

  int selectedIndex = 0;

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  void searchMedicine() {
    final name = searchController.text.trim();

    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a medicine name'),
        ),
      );
      return;
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SearchScreen(
          medicineName: name,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Rare Medicine Finder',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: IndexedStack(
          index: selectedIndex,
          children: [
            _buildHome(),
            const RequestScreen(),
            const MyRequestsScreen(),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: selectedIndex,
        onDestinationSelected: (index) {
          setState(() {
            selectedIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.add_circle_outline),
            label: 'Request',
          ),
          NavigationDestination(
            icon: Icon(Icons.assignment_outlined),
            label: 'My Requests',
          ),
        ],
      ),
    );
  }

  Widget _buildHome() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 15),
          const Icon(
            Icons.health_and_safety,
            size: 65,
            color: primaryColor,
          ),
          const SizedBox(height: 20),
          const Text(
            'Find the medicine you need.',
            style: TextStyle(
              fontSize: 30,
              fontWeight: FontWeight.bold,
              color: Color(0xFF17324D),
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Search medicine listings and explore pharmacies '
            'in your city.',
            style: TextStyle(
              fontSize: 16,
              height: 1.5,
              color: Colors.blueGrey,
            ),
          ),
          const SizedBox(height: 28),
          TextField(
            controller: searchController,
            textInputAction: TextInputAction.search,
            onSubmitted: (_) => searchMedicine(),
            decoration: InputDecoration(
              hintText: 'Enter medicine name',
              prefixIcon: const Icon(
                Icons.search,
                color: primaryColor,
              ),
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
          ),
          const SizedBox(height: 15),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: searchMedicine,
              icon: const Icon(Icons.search),
              label: const Text('Find Medicine'),
              style: FilledButton.styleFrom(
                backgroundColor: primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.all(16),
              ),
            ),
          ),
          const SizedBox(height: 28),
          const Text(
            'Explore Services',
            style: TextStyle(
              fontSize: 21,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 15),
          _serviceCard(
            icon: Icons.medication_outlined,
            title: 'Search Medicines',
            description: 'Search for a medicine by name.',
            onTap: () {
              FocusScope.of(context).unfocus();
              searchController.clear();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Enter a medicine name above.'),
                ),
              );
            },
          ),
          _serviceCard(
            icon: Icons.local_pharmacy_outlined,
            title: 'Find Pharmacies',
            description: 'Explore pharmacy listings.',
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Search for a medicine to explore its listings.',
                  ),
                ),
              );
            },
          ),
          _serviceCard(
            icon: Icons.add_circle_outline,
            title: 'Request a Medicine',
            description: 'Request a medicine you cannot find.',
            onTap: () {
              setState(() {
                selectedIndex = 1;
              });
            },
          ),
          const SizedBox(height: 20),
          const Text(
            'Availability and prices must be confirmed directly '
            'with the pharmacy. Follow advice from a qualified '
            'healthcare professional.',
            style: TextStyle(
              fontSize: 12,
              height: 1.5,
              color: Colors.blueGrey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _serviceCard({
    required IconData icon,
    required String title,
    required String description,
    required VoidCallback onTap,
  }) {
    return Card(
      color: Colors.white,
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: const Color(0xFFDDF4F1),
          child: Icon(icon, color: primaryColor),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }
}

class SearchScreen extends StatelessWidget {
  final String medicineName;

  const SearchScreen({
    super.key,
    required this.medicineName,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Medicine Search')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.medication,
                size: 65,
                color: primaryColor,
              ),
              const SizedBox(height: 20),
              Text(
                medicineName,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Live medicine search will be connected '
                'to your backend in the next step.',
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class RequestScreen extends StatefulWidget {
  const RequestScreen({super.key});

  @override
  State<RequestScreen> createState() => _RequestScreenState();
}

class _RequestScreenState extends State<RequestScreen> {
  final formKey = GlobalKey<FormState>();

  final medicineController = TextEditingController();
  final cityController = TextEditingController();
  final emailController = TextEditingController();

  @override
  void dispose() {
    medicineController.dispose();
    cityController.dispose();
    emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(22),
      child: Form(
        key: formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            const Text(
              'Request a Medicine',
              style: TextStyle(
                fontSize: 27,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Tell us which medicine you are looking for.',
            ),
            const SizedBox(height: 25),
            _textField(
              controller: medicineController,
              label: 'Medicine name',
              requiredField: true,
            ),
            const SizedBox(height: 18),
            _textField(
              controller: cityController,
              label: 'City',
              requiredField: true,
            ),
            const SizedBox(height: 18),
            _textField(
              controller: emailController,
              label: 'Contact email (optional)',
              emailField: true,
            ),
            const SizedBox(height: 25),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () {
                  if (!formKey.currentState!.validate()) {
                    return;
                  }

                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(
                        'Form validated. Backend submission '
                        'will be connected next.',
                      ),
                    ),
                  );
                },
                child: const Text('Validate Request'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _textField({
    required TextEditingController controller,
    required String label,
    bool requiredField = false,
    bool emailField = false,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: emailField
          ? TextInputType.emailAddress
          : TextInputType.text,
      decoration: InputDecoration(
        labelText: label,
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
        ),
      ),
      validator: (value) {
        final text = value?.trim() ?? '';

        if (requiredField && text.isEmpty) {
          return '$label is required';
        }

        if (emailField &&
            text.isNotEmpty &&
            !RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
                .hasMatch(text)) {
          return 'Enter a valid email address';
        }

        return null;
      },
    );
  }
}

class MyRequestsScreen extends StatelessWidget {
  const MyRequestsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.assignment_outlined,
              size: 65,
              color: primaryColor,
            ),
            SizedBox(height: 20),
            Text(
              'My Requests',
              style: TextStyle(
                fontSize: 25,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 12),
            Text(
              'Your submitted requests will appear here '
              'after request tracking is connected.',
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}