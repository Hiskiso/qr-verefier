import {
  ConfigProvider,
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
  Group,
  Gradient,
  Placeholder,
  Button,
  Spinner 
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Avatar } from "antd";
import { useState } from "react";

const App = () => {

  const [userData, setUserData] = useState({})
  const [isLoadingMember, setIsLoadingMember] = useState(false)
  const [isFirstScan, setIsFirstScan] = useState(true)
  const [onEror, setOnEror] = useState(false)

  function onScan(qrData){
    setIsFirstScan(false)
    setOnEror(false)
    let qrString = atob(qrData[0].rawValue)
    let parsedData = JSON.parse(qrString)
    console.log(parsedData)
    // setIsLoadingMember(true)
    // fetch("https://klenrest.ru/vkbot/users/getUser",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({user_id: parsedData._id})
    //   }
    // )
    // .then(r=>r.json())
    // .then(data=> {setUserData(data)})
  }

  function onSubmitFest(){
     setIsLoadingMember(true)
     setOnEror(true)
  //  fetch("https://klenrest.ru/vkbot/users/getUser",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({user_id: parsedData._id})
    //   }
    // )
    // .then(r=>r.json())
    // .then(data=> {setUserData(data)})
  }

  return (
    <ConfigProvider colorScheme="dark">
      <AppRoot>
        <SplitLayout>
          <SplitCol autoSpaced>

            <View id="main" activePanel="main">
              <Panel id="main">
                <PanelHeader>Подтверждение участия</PanelHeader>
                <Group>
                  <Gradient mode="tint" to="top">
                    {isFirstScan ? <Placeholder>Отсканируйте код участника форума</Placeholder> : onEror? <Placeholder>Проихошла ошибка, возможно код недействителен</Placeholder> : <Placeholder
                      icon={isLoadingMember? <Spinner/> :  <Avatar size={96} />}
                      title={isLoadingMember? <Spinner/> : "Алексей Мазелюк"}
                      
                      action={
                        <Button disabled={isLoadingMember} size="m" mode="primary" onClick={()=>{onSubmitFest()}}>
                          Подтвердить участие
                        </Button>
                      }
                    >
                      {isLoadingMember ? <Spinner/> : "Участник не подтвержден"}
                    </Placeholder>}
                  </Gradient>


                  <Scanner
                    onScan={(result) => {

                      // console.log(result);
                     
                      onScan(result)
                    }}
                    sound={false}
                    styles={{ container: { border: "unset" } }}
                  />

  

                </Group>
              </Panel>
            </View>
          </SplitCol>
        </SplitLayout>
      </AppRoot>
    </ConfigProvider>
  );
};

export default App;
