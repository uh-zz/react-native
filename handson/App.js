import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";

import Modal from "react-native-modal";

import { Ionicons } from "@expo/vector-icons";

function Input(props) {
  const [text, setText] = useState("");

  // ボタン押したときの挙動
  const onPress = () => {
    text ? props.addEet(text) : null;
    setText("");
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        onChangeText={(_text) => setText(_text)}
        value={text}
      />
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>ツ○ートする</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  // ツイートのステート
  const [eet, setEet] = useState([]);

  // ツイートをリストに追加する
  // 新しいツイートを上位に追加する
  // (配列の先頭に追加する
  const addEet = (text) => {
    const newEet = [].concat(eet);
    const nowDate = new Date();
    newEet.unshift({
      text,
      id: `${Date.now()}`,
      like: false,
      date: nowDate.toLocaleString(),
    });
    console.log(newEet);
    setEet(newEet);
  };

  // モーダルで編集したメッセージを更新する
  const updateEet = (index, text) => {
    const newEet = [].concat(eet);
    newEet[index].text = text;
    setEet(newEet);
  };

  // いいね機能
  const onLike = (index) => {
    const newEet = [].concat(eet);
    newEet[index].like = !newEet[index].like;
    setEet(newEet);
  };

  // 削除機能
  const onDelete = (index) => {
    const newEet = [].concat(eet);
    newEet.splice(index, 1);
    setEet(newEet);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Input addEet={addEet} />
        <View style={styles.content}>
          <FlatList
            data={eet}
            renderItem={({ item, index }) => (
              <Eet
                index={index}
                text={item.text}
                like={item.like}
                onLike={() => onLike(index)}
                date={item.date}
                onDelete={() => onDelete(index)}
                updateEet={updateEet}
              />
            )}
            keyExtractor={(item) => `${item.id}`}
            contentContainerStyle={styles.contentContainer}
          />
        </View>
        <StatusBar style="light" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#222",
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  button: {
    backgroundColor: "rgb(29, 161, 242)",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderColor: "rgb(29, 161, 242)",
    borderWidth: 2,
    marginRight: 10,
    borderRadius: 10,
    color: "white",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  contentText: {
    color: "white",
    fontSize: 22,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(38, 45, 52, 1)",
    opacity: 0.7,
    borderRadius: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    flexDirection: "row",
    marginBottom: 15,
    borderColor: "rgb(29, 161, 242)",
    borderWidth: 2,
    marginRight: 10,
    borderRadius: 10,
    textAlign: "left",
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

function Eet(props) {
  const { index, text, like, onLike, date, onDelete } = props;

  // モーダル用
  const [modalVisible, setModalVisible] = useState(false);

  // モーダル表示
  const showModal = () => {
    setModalVisible(true);
  };

  // モーダル非表示
  const closeModal = () => {
    setModalVisible(false);
  };

  // モーダルのテキスト状態保持
  const [modalText, setModalText] = useState(text);

  // モーダルボタン押したときの挙動
  const onModalPress = () => {
    modalText ? props.updateEet(index, modalText) : null;
    setModalText(text);
    closeModal();
  };

  return (
    <View>
      <TouchableOpacity style={eetStyles.container} onPress={() => showModal()}>
        <View style={eetStyles.subContainer}>
          <Text style={eetStyles.text}>{text}</Text>
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="close" size={22} color="rgb(252, 108, 133)" />
          </TouchableOpacity>
        </View>
        <View style={eetStyles.actionContainer}>
          <TouchableOpacity onPress={onLike}>
            {like ? (
              <Ionicons
                name="heart-circle-sharp"
                size={22}
                color="rgb(252, 108, 133)"
              />
            ) : (
              <Ionicons
                name="ios-heart-circle-outline"
                size={22}
                color="#aaa"
              />
            )}
          </TouchableOpacity>
          <Text style={eetStyles.date}>{date}</Text>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              autoCapitalize="none"
              onChangeText={(_modalText) => setModalText(_modalText)}
              value={modalText}
              style={styles.modalText}
            />

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onModalPress}
            >
              <Text style={styles.textStyle}>ツ○ートの更新</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const eetStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: "rgb(29, 161, 242)",
    marginBottom: 10,
    borderRadius: 5,
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: "#aaa",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
    marginTop: 20,
  },
  date: {
    color: "white",
  },
});
