import { getFile } from "@/backend/api/storage";
import UserViewerButton from "@/components/user-viewer-button";

export default async function UserFileViewer({ id }:{ id: string }){
  try{
    const file = await getFile(id);
    const origin = new URL(process.env.STORAGE_SRV_URL as string)?.origin;

    return (
      <UserViewerButton driveFile={{
        name: file.name,
        link: [origin, file.link].join(""),
        size: file.size,
        extension: file.extension
      }} />
    );
  } catch {
    return <></>;
  }
}