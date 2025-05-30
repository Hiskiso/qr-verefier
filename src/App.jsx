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
  Spinner,
  Badge,
  Avatar,
  Separator, 
  Header,
  Card,
  Skeleton 
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { Icon24CancelCircleFillRed, Icon24CheckCircleOn } from '@vkontakte/icons';



const App = () => {

  const [isManager, setIsManager] = useState(false)
  const [simpleLogs, setSimpleLogs] = useState([])
  const [userData, setUserData] = useState({})
  const [isLoadingMember, setIsLoadingMember] = useState(false)
  const [isFirstScan, setIsFirstScan] = useState(true)
  const [onEror, setOnEror] = useState(false)
  const [managerModeCounter, setManagerModeCounter] = useState(0)


  function updateManagerMode(){
    if(managerModeCounter > 5){
      setIsManager(true)
    }
    setManagerModeCounter(managerModeCounter+1)
  }


  function myLogs(log){
    console.log(log)
    setSimpleLogs(simpleLogs => [...simpleLogs, JSON.stringify(log, null ,3)])
  }

  function onScan(qrData){
    setIsFirstScan(false)
    setOnEror(false)
    let qrString = atob(qrData[0].rawValue)
    let parsedData = JSON.parse(qrString)
    myLogs(qrData[0].rawValue)
    myLogs(parsedData)
    

    setIsLoadingMember(true)
    fetch("https://klenrest.ru/vkbot/users/get_by_id",
      {
        method: "POST",
        body: JSON.stringify({id: parsedData._id}),
        headers:{"content-type":"application/json"}
      }
    )
    .then(r=>r.json())
    .then(data=> {
      if(data.status !== "sucess") {
        myLogs(data)
        setOnEror(true)
        return
      }

      myLogs(data)
     
      setUserData(data.description)

setIsLoadingMember(false)
    })
    .catch((er)=> {
      myLogs(er)
        setOnEror(true)
    })
  }


  function onSubmitFest(){
     setIsLoadingMember(true)
   fetch("https://klenrest.ru/vkbot/users/change_feststatus",
      {
        method: "POST",
        body: JSON.stringify({id: userData._id, status: true}),
        headers:{"content-type":"application/json"}
      }
    )
    .then(r=>r.json())
    .then(data=> {
      
      myLogs(data)

      if(data.status !== "sucess")
      {
        myLogs(data)
        setOnEror(true)
        return
      }

      setUserData(data.description)

setIsLoadingMember(false)
    })
    .catch((er)=> {
      myLogs(er)
        setOnEror(true)
    })
    
  }

  return (
    <ConfigProvider colorScheme="dark">
      <AppRoot>
        <SplitLayout>
          <SplitCol autoSpaced>

            <View id="main" activePanel="main">
              <Panel id="main">
                <PanelHeader onClick={()=>{updateManagerMode()}}>Подтверждение участия</PanelHeader>
                <Group>
                  <Gradient mode="tint" to="top">
                    {isFirstScan ? <Placeholder>Отсканируйте код участника форума</Placeholder> : onEror? <Placeholder>Проихошла ошибка, возможно код недействителен</Placeholder> : <Placeholder
                      icon={isLoadingMember? <Skeleton width={90} height={90} borderRadius={50}/> :  <Avatar size={96} src={userData.photo_200} > {userData.festival_users?  <Avatar.Badge background="stroke"><Icon24CheckCircleOn /></Avatar.Badge>  : <Avatar.Badge background="stroke"><Icon24CancelCircleFillRed /></Avatar.Badge>} </Avatar>}
                      title={isLoadingMember? <Skeleton width={200}/> : `${userData.name}`}
                      
                      action={
                        <Button disabled={userData.festival_users} size="m" mode="primary" onClick={()=>{onSubmitFest()}}>
                          Подтвердить участие
                        </Button>
                      }
                    >
                      {isLoadingMember ? <Skeleton width={90} /> : `Участник ${userData.festival_users? "" : "не"} подтвержден`}
                    </Placeholder>}
                  </Gradient>


                  <Scanner
                    onScan={(result) => {
                     
                      onScan(result)
                    }}
                    sound={false}
                    styles={{ container: { border: "unset" } }}
                  />

                </Group>

{
  isManager? <Group header={<Header>Сервисная информация</Header>}>
    {simpleLogs.map(log=>{
      return(<Group> <Card style={{padding:"12px"}} mode="outline-tint">{log}</Card></Group>)
    })}
  </Group> : ""
}

              </Panel>
            </View>
          </SplitCol>
        </SplitLayout>
      </AppRoot>
    </ConfigProvider>
  );
};

export default App;
