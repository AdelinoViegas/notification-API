"use client";

export default function forceRefreshPage(){
  if(!window) console.log('windows object is not defined!');
  window.location.reload();
}