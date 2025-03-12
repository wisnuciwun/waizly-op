import React from 'react';
import { Button, Block, BlockContent, BlockDes, BlockHead, BlockTitle } from '@/components';


export default function Home() {
  return (
    <>
      <Block className="nk-block-middle nk-auth-body">
        <BlockHead>
          <BlockContent>
            <BlockTitle tag="h4">Thank you for submitting form</BlockTitle>
            <BlockDes className="text-success">
              <p>You can now sign in with your new password</p>
              
              <Button color="primary" size="lg" onClick={() => { location.href='/login';}}>
                Back to Login
              </Button>
            </BlockDes>
          </BlockContent>
        </BlockHead>
      </Block>
    </>
    
  );
}
