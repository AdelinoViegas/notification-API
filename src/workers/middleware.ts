onmessage = async (e)=>{
  const res = await fetch(`/v1?p=${btoa(e.data)}`);
  const data = await res.json();
}