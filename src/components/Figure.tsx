export type FigureProps = {
  src: string;
  caption: string;
  className: React.HTMLAttributes<HTMLElement>['className'];
}


export default function Figure(props: FigureProps) {
  return (
    <figure className={props.className}>
      <img src={props.src} alt={props.caption} />
      <figcaption>{props.caption}</figcaption>
    </figure>
  )
}