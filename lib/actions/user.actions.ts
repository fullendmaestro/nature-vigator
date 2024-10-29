"use server";

interface CreateContentParams {
  name: string;
  type: string;
  description: string;
  details: string;
  image: File;
}

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";

import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_CONTENT_COLLECTION_ID: CONTENT_COLLECTION_ID,
  APPWRITE_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserName = async (userId: string) => {
  try {
    const { database } = await createAdminClient();
    const userDocument = await database.getDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      userId
    );
    return userDocument.name;
  } catch (error) {
    console.error("Error fetching user name:", error);
    throw error;
  }
};
export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, fullName } = userData;

  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      fullName
    );

    if (!newUserAccount) throw new Error("Error creating user");

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    return parseStringify(user);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const fetchContents = async () => {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized access");

    console.log("Logged in user:", loggedInUser);

    const { database } = await createAdminClient();

    console.log("DATABASE_ID:", DATABASE_ID);
    console.log("CONTENT_COLLECTION_ID:", CONTENT_COLLECTION_ID);

    const response = await database.listDocuments(
      DATABASE_ID!,
      CONTENT_COLLECTION_ID!
    );

    console.log("Fetched chats response:", response);

    return parseStringify(response.documents);
  } catch (error) {
    console.error("Error fetching chats list:", error);
  }
};

export const fetchContentById = async (contentId: string) => {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized access");

    const { database } = await createAdminClient();

    const response = await database.getDocument(
      DATABASE_ID!,
      CONTENT_COLLECTION_ID!,
      contentId
    );

    return parseStringify(response);
  } catch (error) {
    console.error("Error fetching content by ID:", error);
  }
};

export const createContent = async ({
  name,
  type,
  description,
  details,
  image,
}: CreateContentParams) => {
  try {
    console.log("Creating content...", name, type, description, image);
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized access");

    const { storage, database } = await createAdminClient();

    const fileId = ID.unique();
    const imageFile = await storage.createFile(BUCKET_ID, fileId, image);

    console.log("Image file uploaded:", imageFile);

    const content = await database.createDocument(
      DATABASE_ID!,
      CONTENT_COLLECTION_ID!,
      ID.unique(),
      {
        name,
        type,
        description,
        image: imageFile.$id,
        imageUrl: `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${imageFile.$id}/view?project=${PROJECT_ID}&project=${PROJECT_ID}&mode=admin`,
        details,
        userId: loggedInUser.userId,
      }
    );

    return parseStringify(content);
  } catch (error) {
    console.error("Error creating content:", error);
    throw error;
  }
};
