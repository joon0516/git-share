import { useEffect } from 'react';
import { execCommand } from '~/utils/git';

interface TestProps {
  placeholder: string;
}

function Test(props: TestProps) {
  useEffect(() => {
    execCommand('git clone https://github.com/joon0516/Spinning-Donut.git')
      .then((s) =>
        s.match(
          (o) => alert(`result sucess ${o}`),
          (e) => alert(`result error ${e}`),
        ),
      )
      .catch((e) => alert(`standard error ${e}`));
  }, []);

  return <div>Test</div>;
}

export default Test;
