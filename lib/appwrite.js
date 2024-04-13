import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: process.env.EXPO_PUBLIC_PLATFORM,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  dbId: process.env.EXPO_PUBLIC_DATABASE_ID,
  usersCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
  videosCollectionId: process.env.EXPO_PUBLIC_VIDEOS_COLLECTION_ID,
  storageId: process.env.EXPO_PUBLIC_STORAGE_ID,
};

// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const db = new Databases(client);
const storage = new Storage(client);

export async function createUser({ email, password, username }) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await db.createDocument(
      config.dbId,
      config.usersCollectionId,
      ID.unique(),
      {
        account_id: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log("[SIGNUP_ERROR]", error);
    throw new Error(error);
  }
}

export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    console.log("[SIGNIN_ERROR]", error);
    throw new Error(error);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log("[ACCOUNT_FETCH_ERROR]", error);
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await db.listDocuments(
      config.dbId,
      config.usersCollectionId,
      [Query.equal("account_id", currentAccount?.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log("[CURRENT_USER_FETCH_ERROR]", error);
    console.log(error);
    return null;
  }
}

export async function getAllPosts() {
  try {
    const posts = await db.listDocuments(
      config.dbId,
      config.videosCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    console.log("[POST_FETCH_ERROR]", error);
    throw new Error(error);
  }
}

export async function getLatestPosts() {
  try {
    const posts = await db.listDocuments(
      config.dbId,
      config.videosCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );

    return posts.documents;
  } catch (error) {
    console.log("[LATEST_POST_FETCH_ERROR]", error);
    throw new Error(error);
  }
}

export async function searchPosts(query) {
  try {
    const posts = await db.listDocuments(
      config.dbId,
      config.videosCollectionId,
      [Query.search("title", query), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    console.log("[QUERY_POST_FETCH_ERROR]", error);
    throw new Error(error);
  }
}

export async function getUserposts(userId) {
  try {
    const posts = await db.listDocuments(
      config.dbId,
      config.videosCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    console.log("[MY_POST_FETCH_ERROR]", error);
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log("[SIGN_OUT_ERROR]", error);
    throw new Error(error);
  }
}

export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw new Error("File not found");

    return fileUrl;
  } catch (error) {
    console.log("[FILE_PREVIEW_ERROR]", error);
    throw new Error(error);
  }
}

export async function uploadFile(file, type) {
  try {
    if (!file) return;

    const asset = {
      size: file.fileSize ?? 0,
      name: file.fileName ?? file.uri.split("/").pop(),
      type: file.mimeType,
      uri: file.uri,
    };

    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    return getFilePreview(uploadedFile.$id, type);
  } catch (error) {
    console.log("[FILE_UPLOAD_ERROR]", error);
    throw new Error(error);
  }
}

export async function createVideo({ thumbnail, video, title, prompt, userId }) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(thumbnail, "image"),
      uploadFile(video, "video"),
    ]);

    const newPost = await db.createDocument(
      config.dbId,
      config.videosCollectionId,
      ID.unique(),
      {
        thumbnail: thumbnailUrl,
        video: videoUrl,
        title,
        prompt,
        creator: userId,
      }
    );

    return newPost;
  } catch (error) {
    console.log("[VIDEO_CREATE_ERROR]", error);
    throw new Error(error);
  }
}
