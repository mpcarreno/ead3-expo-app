import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SearchUser() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [allUIDs, setAllUIDs] = useState<string[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const stored = await AsyncStorage.getItem("user_ids");
    setAllUIDs(stored ? JSON.parse(stored) : []);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length === 0) {
      setResults([]);
      return;
    }

    const filtered = allUIDs.filter((u) => u.startsWith(text));
    setResults(filtered);
  };

  const selectUser = async (uid: string) => {
    setSearch(uid);
    setResults([]);

    const data = await AsyncStorage.getItem(`user_${uid}`);
    setSelectedUser(data ? JSON.parse(data) : null);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por número de identificación"
        value={search}
        onChangeText={handleSearch}
        keyboardType="numeric"
      />

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.option} onPress={() => selectUser(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedUser && (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Nombre:</Text>
          <Text>{selectedUser.name} {selectedUser.lastName}</Text>

          <Text style={styles.label}>Edad:</Text>
          <Text>{selectedUser.ageAtCreation.rangeName || selectedUser.ageAtCreation.range}</Text>
        </View>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  input: { borderWidth: 1, padding: 10, borderRadius: 10, marginBottom: 10 },
  option: { padding: 10, backgroundColor: "#ddd", marginVertical: 4, borderRadius: 8 },
  userInfo: { marginTop: 20, padding: 20, backgroundColor: "#f3f3f3", borderRadius: 10 },
  label: { fontWeight: "bold", marginTop: 10 }
});
