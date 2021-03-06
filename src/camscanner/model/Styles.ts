import {Dimensions, StyleSheet} from 'react-native';

export class Styles {
  public static INSTANCE = new Styles();
  WINDOW_WIDTH = 0;
  GALLERY_CELL_PADDING = 20;

  imageResults: any;

  public static NEAR_WHITE = 'rgb(250, 250, 250)';
  public static LIGHT_GRAY = 'rgb(245, 245, 245)';

  public static ScanbotTheme = {
    dark: false,
    colors: {
      primary: Styles.NEAR_WHITE,
      background: Styles.NEAR_WHITE,
      card: '#13C2C2',
      text: Styles.NEAR_WHITE,
      border: Styles.NEAR_WHITE,
    },
  };

  constructor() {
    this.WINDOW_WIDTH = Dimensions.get('window').width;
    this.imageResults = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      gallery: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      galleryCell: {
        width: (this.WINDOW_WIDTH - 4 * this.GALLERY_CELL_PADDING) / 3,
        height: (this.WINDOW_WIDTH - 4 * this.GALLERY_CELL_PADDING) / 3,
        marginLeft: this.GALLERY_CELL_PADDING,
        marginTop: this.GALLERY_CELL_PADDING,
        backgroundColor: Styles.LIGHT_GRAY,
      },
    });
  }

  public common = StyleSheet.create({
    bottomBar: {
      width: '100%',
      height: 50,
      backgroundColor: '#13C2C2',
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
    },
    bottomBarButton: {
      flex: 1,
      height: 50,
      width: 150,
      lineHeight: 50,
      textAlignVertical: 'center',
      textAlign: 'center',
      color: 'white',
      paddingLeft: 10,
      paddingRight: 10,
      marginRight: 10,
      fontWeight: 'bold',
      fontSize: 13,
    },
    alignRight: {
      marginLeft: 'auto',
    },
    progress: {
      color: '#13C2C2',
      position: 'absolute',
      left: '47%',
      top: '40%',
      width: '6%',
    },
    containImage: {
      resizeMode: 'contain',
    },
    copyrightLabel: {
      textAlign: 'center',
      lineHeight: 40,
      width: '100%',
      height: 40,
      position: 'absolute',
      bottom: 0,
      color: 'gray',
      fontSize: 12,
    },
  });

  public imageDetails = StyleSheet.create({
    image: {
      width: '94%',
      height: '70%',
      marginLeft: '3%',
      marginTop: '3%',
    },
  });

  public home = StyleSheet.create({
    list: {
      marginTop: '1%',
      marginLeft: '5%',
      height: '90%',
      width: '90%',
    },
    sectionHeader: {
      fontSize: 13,
      marginTop: 25,
      marginBottom: 0,
      fontWeight: 'bold',
      color: '#696969',
    },
    sectionItemContainer: {
      borderBottomColor: '#bdbdbd',
      borderBottomWidth: 1,
    },
    sectionItem: {
      fontSize: 17,
      marginTop: 14,
      marginBottom: 5,
    },

    footer: {
      // color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });

  public modal = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    text: {
      marginBottom: 15,
      textAlign: 'center',
    },
    button: {
      borderRadius: 5,
      paddingLeft: 10,
      paddingRight: 10,
      height: 40,
      width: 200,
      marginTop: 10,
      textAlign: 'center',
      lineHeight: 40,
      overflow: 'hidden',
    },
    actionButton: {
      color: 'white',
      backgroundColor: '#13C2C2',
      fontWeight: 'bold',
    },
    closeButton: {
      borderColor: 'gray',
      borderWidth: 1,
    },
  });
}
