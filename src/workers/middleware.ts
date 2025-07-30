// onmessage = async (e: MessageEvent<string>)=>{
//   if(e.data !== '/' && e.data !== "/workplace" && !e.data.includes("/manager")){
//     const res = await fetch(`/v1?p=${btoa(e.data)}`);
//     const data = await res.json();
//     postMessage(data);
//   }
// }

onmessage = () => postMessage(true);