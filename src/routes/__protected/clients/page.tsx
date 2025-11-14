import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@mantine/core';
import React from 'react';

type TPageProps = {};

const Page = ({}: TPageProps) => {
  const { currentUser } = useAppContext();
  console.log(currentUser.data);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Button className="font-sora">Hello</Button>
    </div>
  );
};

export default Page;
