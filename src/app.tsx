import { useDisentangle, useMemo, useMount, useRecrudescence, useReference, useSignal } from ".";
import useImperativeReference from "./use/use-imperative-reference";

function Home(props, reference) {

  const {
    children,
    show,
  } = props;

  const list = useSignal(
    [1, 2, 3].map((...[, index]) => ({
      name: index,
      id: crypto.randomUUID()
    }))
  );

  const on = {
    push() {
      list.value.push({
        name: 1,
        id: crypto.randomUUID(),
      })
    },
    unshift() {
      list.value.unshift({
        name: 1,
        id: crypto.randomUUID(),
      })
    },
    pop() {
      list.value.pop();
    }
  }

  useImperativeReference(
    reference,
    () => ({
      add: () => {

      }
    })
  );

  return (
    <div>
      <div>
        {
          show.value ?
            children :
            list.value.tabulate((item) => <div use:key={item.id}>{item.name}</div>)
        }
      </div>
      <div>
        <button on:click={on.unshift}>unshift</button>
        <button on:click={on.push}>push</button>
        <button on:click={on.pop}>pop</button>
      </div>
    </div>
  )
}

const Disentangle = () => {
  useDisentangle(() => {
    console.log('销毁1');
  });
  useDisentangle(() => {
    console.log('销毁2');
  });
  const id = useReference();
  useMount(() => {
    console.log(id.reference, 1);
  })
  return (
    <div use:reference={id}>Disentangle</div>
  )
}

const About = () => {
  useDisentangle(() => {
    console.log('销毁3');
  });
  useDisentangle(() => {
    console.log('销毁4');
  });

  const id = useReference();
  useMount(() => {
    console.log(id.reference, 2);
  })
  return (
    <div use:reference={id}>Disentangle</div>
  )
}

export default function App() {

  const count = useSignal(0);

  const show = useSignal(true);
  const hide = useSignal(false)

  const onclick = () => show.value = !show.value

  const onhide = () => hide.value = !hide.value;

  const input = useSignal('0');

  const id = useReference();

  useMount(() => {
    console.log(<About />);
  });

  return (
    <div>
      <Home show={show} use:reference={id} use:key="1">
        <input
          on:input={(event) => input.value = event.target.value}
          value={input.value}
        />
      </Home>
      <div>1{show.value ? <About /> : <Disentangle />}</div>
      <span>{count.value}</span>
      <div>
        {input.value}
        {
          hide.value && <span style={{ color: show.value ? 'red' : 'blue' }}>
            {input.value}
          </span>
        }
      </div>
      <button on:click={onclick}>show</button>
      <button on:click={onhide}>hide</button>
      <button on:click={() => count.value += 1}>{count.value}</button>
    </div>
  )
}
