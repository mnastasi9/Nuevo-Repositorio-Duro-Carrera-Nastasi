"use client"

export default function Button(props) {
    return (
      <button type="button" onClick={props.onClick}>{props.children}</button>
    );
}