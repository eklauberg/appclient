import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Preload from '../screens/Preload';
import Login from '../screens/Login';
import Maior_18 from '../screens/Maior_18';
import CheckCadastro from '../screens/CheckCPF';
import FormCadastroPrimeiroPasso from '../screens/FormCadastroPrimeiroPasso';
import FormCadastroSegundoPasso from '../screens/FormCadastroSegundoPasso';
import PreLogin from '../screens/PreLogin';
import Nao_Maior from '../screens/Nao_Maior';
import Principal from '../screens/Principal';
import Recarga from '../screens/Recarga';
import Minhas_Contas from '../screens/Minhas_Contas';
import Movimentacoes from '../screens/Movimentacoes';
import Buscar_Chopp from '../screens/Buscar_Chopp';
import Recarga2 from '../screens/Recarga2';
import Perfil from "../screens/Perfil";
import Locais from "../screens/Locais";
import Creditos from "../screens/Creditos";
import RecargaPontosDeVenda from "../screens/RecargaPontosDeVenda";
import Transacoes from "../screens/Transacoes";
import Nfc from "../screens/Nfc";
import Mensagens from "../screens/Mensagens";
import Cupons from "../screens/Cupons";
import Configuracoes from "../screens/Configuracoes";
import RecuperarSenha from "../screens/RecuperarSenha";
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../screens/DrawerContent';
import CreditCard from '../screens/CreditCard';
import SelecionarCartao from '../screens/SelecionarCartao';
import FormSocialLogin from '../screens/FormSocialLogin';
import SobreApp from '../screens/SobreApp';
import QrCode from '../screens/QrCode';

const Stack = createDrawerNavigator();

export default ( props ) => (
    <Stack.Navigator
        initialRouteName="Preload"
        screenOptions={{
            headerShown: false
        }} drawerContent={props => (<DrawerContent {...props} />)}
    >
        <Stack.Screen name="Preload" component={Preload} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="maioridade" component={Maior_18} />
        <Stack.Screen name="check-cpf" component={CheckCadastro} />
        <Stack.Screen name="form-cadastro-primeiro-passo" component={FormCadastroPrimeiroPasso} />
        <Stack.Screen name="form-cadastro-segundo-passo" component={FormCadastroSegundoPasso} />
        <Stack.Screen name="PreLogin" component={PreLogin} />
        <Stack.Screen name="Nao_Maior" component={Nao_Maior} />
        <Stack.Screen name="Principal" component={Principal} />
        <Stack.Screen name="Recarga" component={Recarga} />
        <Stack.Screen name="Recarga2" component={Recarga2} />
        <Stack.Screen name="Minhas_Contas" component={Minhas_Contas} />
        <Stack.Screen name="Movimentacoes" component={Movimentacoes} />
        <Stack.Screen name="Buscar_Chopp" component={Buscar_Chopp} />
        <Stack.Screen name="perfil" component={Perfil} />
        <Stack.Screen name="locais" component={Locais} />
        <Stack.Screen name="creditos" component={Creditos} />
        <Stack.Screen name="recarga" component={Recarga} />
        <Stack.Screen name="selecionar-ponto-de-venda" component={RecargaPontosDeVenda} />
        <Stack.Screen name="transacoes" component={Transacoes} />
        <Stack.Screen name="nfc-activator" component={Nfc} />
        <Stack.Screen name="mensagens" component={Mensagens} />
        <Stack.Screen name="cupons" component={Cupons} />
        <Stack.Screen name="configuracoes" component={Configuracoes} />
        <Stack.Screen name="recuperar-senha" component={RecuperarSenha} />
        <Stack.Screen name="credit-card" component={CreditCard} />
        <Stack.Screen name="selecionar-cartao" component={SelecionarCartao} />
        <Stack.Screen name="form-social-login" component={FormSocialLogin} />
        <Stack.Screen name="sobre-app" component={SobreApp} />
        <Stack.Screen name="qr-code" component={QrCode} />
    </Stack.Navigator>
);